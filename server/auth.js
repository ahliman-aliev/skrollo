const axios = require('axios')
const app = require('express')()

const API_URI = process.env.API_URI || "https://api.skrollo.com"
// const API_URI = "http://localhost:8000"

app.post('/login/', async (req, res) => {  
  try {
    const result = await axios.post(API_URI + '/api/auth/jwt/create/', req.body)
    req.session.authToken = result.data.access
    req.session.refreshToken = result.data.refresh
    req.session.tokenType = "JWT"
    await req.session.save()
    return res.json({"OK": true})
  } catch (e) {
    return res.status(401).json({ error: 'Bad credentials' })
  }
})

app.post('/refresh/', async (req, res) => {  
  try {
    const result = await axios.post(API_URI + '/api/auth/jwt/refresh/', {refresh: req.session.refreshToken})
    req.session.authToken = result.data.access
    await req.session.save()
    return res.json({"OK": true})
  } catch (e) {
    return res.status(401).json({ error: 'Bad credentials / Token Expired' })
  }
})

app.post('/logout/', async (req, res) => {
  delete req.session.authToken  
  delete req.session.refreshToken 
  delete req.session.tokenType 

  await req.session.save()
  await axios.post(API_URI + '/api/auth/token/logout/')
  return res.status(200).json({ ok: true })
})

app.post('/login/google', async (req, res) => {
  // Auth Code  
  let code = req.body.auth
  
  try {
    const access = await axios.post("https://accounts.google.com/o/oauth2/token", {
      client_secret:"y-_NSzYUXwjEKO8WyxYfwdn-", 
      redirect_uri: "postmessage", 
      grant_type:"authorization_code", 
      client_id:"428968004852-stn9715pd2o0k9lohiph9autiulev894.apps.googleusercontent.com", 
      code: code
    })
    // Get the access token    
    // Log in the user

    let login_res = await axios.post(API_URI + '/api/oath/convert-token', {
      grant_type: "convert_token",
      client_id: "OGo3Q9es3SfhmeS5mbRSHqbbCXHe67v2SisBoU0F",
      client_secret: "4oBFTTkh3in8Q1xr9H0EF7nLjZkmJwbl1r6gZYGK9pn2AGScdD1XCMpul0ovkxWzMCWcxEzWuYj91afyH6X8aSWA9uUtfcCbyR5g3FSMPyWUmHR5MoLCX0nHL7yjlDPm",
      backend:"google-oauth2",
      token: access.data.access_token
    })
    
    req.session.authToken = login_res.data.access_token
    req.session.refreshToken = login_res.data.refresh_token
    req.session.tokenType = login_res.data.token_type
    req.session.save()

    return res.json({"OK": true})
  } catch (e) {
    return res.status(401)
  }
})

module.exports = {
  path: '/auth',
  handler: app
}
