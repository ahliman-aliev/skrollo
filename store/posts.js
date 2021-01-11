export const state = () => ({
    list: [], // All items to be displayed on the feed
    selected: null, // Object of the selected post
    page: 1,
    sources: [{
            id: 1,
            name: "reddit",
            url: "http://reddit.com",
            logo: "/images/social/reddit-icon.png"
        },
        {
            id: 2,
            name: "9gag",
            url: "http://9gag.com",
            logo: "/images/social/9gag-icon.png"
        },
        {
            id: 3,
            name: "imgur",
            url: "http://imgur.com",
            logo: "/images/social/imgur-icon.png"
        },
        {
            id: 4,
            name: "giphy",
            url: "http://giphy.com",
            logo: "/images/social/giphy-icon.png"
        },
        {
            id: 5,
            name: "buzzfeed",
            url: "http://buzzfeed.com",
            logo: "/images/social/buzzfeed-icon.png"
        },
        {
            id: 6,
            name: "twitter",
            url: "http://twitter.com",
            logo: "/images/social/twitter-icon.png"
        },
        {
            id: 7,
            name: "tumblr",
            url: "http://tumblr.com",
            logo: "/images/social/tumblr-icon.png"
        },
        {
            id: 8,
            name: "youtube",
            url: "http://youtube.com",
            logo: "/images/social/youtube.png"
        },
        {
            id: 9,
            name: "Skrollo",
            url: "http://Skrollo.com",
            logo: "/images/social/Skrollo-icon.png"
        },
        {
            id: 10,
            name: "TikTok",
            url: "http://tikok.com",
            logo: "/images/social/TikTok-icon.svg"
        }
    ],
    filter: {
        "reddit":4,
        "imgur":4,
        "9gag":4,
        "twitter":4,
        "buzzfeed":4,
        "giphy":4,
        "tumblr":4,
        "youtube":4,
        "instagram":4
    },
    perPage: {
        
    },
    search: "",
    related: [], //Posts to show down the side of a selected post
    isLoading: true // Are we currently requesting a new page
});

export const mutations = {
    setPosts(state, posts) {
        state.list = posts;
    },
    addPage(state, posts) {
        state.list = state.list.concat(posts);
    },
    incrementPage(state) {
        state.page++;
    },
    setPage(state, page) {
        state.page = page;
    },
    updateFilter(state, filter) {
        state.filter = filter;
    },
    updateSearch(state, search) {
        state.search = search;
    },
    updateSources(state, sources) {
        state.sources = sources;
    },
    selectPost(state, post) {
        //Check if th post was already on the feed (Get that first)
        state.selected = post;
    },
    setRelated(state, posts) {
        state.related = posts;
    },
    setLoading(state, loading) {
        state.isLoading = loading;
    },
    setPerpage(state, pages) {
        state.perPage = pages;
    },
    likePost(state, post) {
        post.user_liked = !post.user_liked;
    },
    decrementPost(state, post) {
        post.like_count -= 1;
    },
    incrementPost(state, post) {
        post.like_count += 1;
    },
    setUserLike(state, posts) {
        state.list = posts;
    },
};

export const actions = {
    async nuxtServerInit({ dispatch }) {
        await dispatch("posts/fetchPage");
    },
    // getUserLike({ commit, state }) {
    //     // return this.$axios.$get("/api/account/" + username + "/liked").then(res => {
    //     //     res.source = state.sources.filter(s => s.id == 78295);
    //     //     commit("getUserLike", res);
    //     // });
    //     return this.$axios.$get("/api/posts/78295/related").then(res => {
    //         res.map(
    //             item =>
    //             (item.source = state.sources.filter(s => s.id == 78295)[0].name)
    //         );
    //         commit("getUserLike", res);
    //     });
    // },
    selectPost({ commit, state }, id) {
        let local_post = state.list.filter(post => post.id == id);
        if (local_post.length == 1) {
            commit("selectPost", local_post[0]);
        } else {
            return this.$axios.$get("/api/posts/" + id).then(res => {
                res.source = state.sources.filter(s => s.id == res.source)[0];
                commit("selectPost", res);
            });
        }
    },
    async fetchPage({ commit, state }) {
        // filter=reddit=4
        let url = "/api/posts/";
        let params = "";
        if (state.filter) {
            for (const key in state.filter) {
                params += "filter=" + key + "=" + state.filter[key] + "&";
            }
        }

        if (state.search != "") {
            params += "q=" + state.search + "&";
        }

        if (state.page != 0) {
            params += "page=" + state.page + "&";
        }

        if (params != "") {
            url = url + "?" + params;
        }

        commit("setLoading", true);

        await this.$axios.$get(url).then(res => {
            
            res.sort((a, b) => a.id - b.id);

            commit("addPage", res);
            setTimeout(() => {
                commit("setLoading", false);
            }, 1000);

            commit("incrementPage");
        });
    },

    async getUserLike({ commit, state }, username) {
        // filter=reddit=4
        let url = "/api/account/" + username + '/liked';        
        await this.$axios.$get(url).then(res => {
            res.map(
                item =>
                (item.source = state.sources.filter(s => s.id == item.source)[0])
            );
            // local_post = res.list.filter(post => post.user_liked == true);
            // res.sort((a, b) => a.id - b.id);            
            commit("setPosts", res);
            setTimeout(() => {
                commit("setLoading", false);
            }, 1000);

        });
    },

    resetFeed({ commit, state }) {
        // Remove the posts in the feed and set the page number
        commit("setPosts", []);
        commit("setPage", 0);
    },
    getRelated({ commit, state }, id) {
        return this.$axios.$get("/api/posts/" + id + "/related").then(res => {
            res.map(
                item =>
                (item.source = state.sources.filter(s => s.id == item.source)[0])
            );
            commit("setRelated", res);
        });
    },
    likePost({ commit, state }, post) {
        // Reversed because we change it locally first
        if (!post.user_liked) {
            return this.$axios.$delete("/api/posts/" + post.id + "/like/");
        } else {
            return this.$axios.$post("/api/posts/" + post.id + "/like/");
        }
    }
};

export const getters = {};