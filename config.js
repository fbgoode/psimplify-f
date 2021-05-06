import { Auth } from '@aws-amplify/auth';

export default {
    Auth: {
        userPoolId: "eu-central-1_e4NS5sZFi",
        userPoolWebClientId: "f7enjtdd8i96pjbvjk1d5iuaj",
        region: "eu-central-1"

        // OPTIONAL - customized storage object
        // storage: MyStorage,
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        // authenticationFlowType: 'USER_PASSWORD_AUTH',
        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        // clientMetadata: { myCustomKey: 'myCustomValue' }
    },
    API: {
        endpoints: [
            {
                name: "protectedAPI",
                endpoint: "https://r17cnh7yyk.execute-api.eu-central-1.amazonaws.com",
                custom_header: async () => { 
                //   return { Authorization : 'token' } 
                  // Alternatively, with Cognito User Pools use this:
                //   return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
                  return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
                }
            },
            {
                name: "localAPI",
                endpoint: "http://127.0.0.1:3001"
            }
        ]
    }
}