import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import tw from 'twrnc';
import Login from './components/Login';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function App() {

  const [accessToken,setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:"761514127363-itu4k40d9egq5th32nbk9hqhucn6h1nv.apps.googleusercontent.com",
  })

  useEffect(() => {
  if(response?.type ==="success"){
    setAccessToken(response.authentication.accessToken)
  }
  }, [response])

  async function getUserData(){
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers: {Authorization: `Bearer ${accessToken}`}
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    })
  }
  
  function showUserInfo(){
    if(userInfo){
      return (
        <View style = {tw`h-full w-full bg-red-500`}>
          <Image source = {{uri:userInfo.picture}} style = {tw`h-60 w-60 border border-green-200`}></Image>
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View> 
      )
    }
  }

  return (
    <SafeAreaView>
     <View style = {tw`flex h-full bg-red-500 items-center justify-center`}>
    {userInfo?showUserInfo():null}
     <Button
     title = {accessToken? "Get User Data": "Login"}
     onPress = {accessToken ? getUserData : ()=>{promptAsync({showInRecents:true})} }
     ></Button>
        <Login />
     </View>
    </SafeAreaView>
  );
}
