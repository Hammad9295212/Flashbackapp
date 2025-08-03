import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    updateEmail
} from 'firebase/auth';
import {
    get, getDatabase, push,
    ref, remove, set, update,
    query, orderByChild, equalTo

} from 'firebase/database';
import {Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export let intervalId = null;
export const googleMapKey = ``;
export const youtubeAPI = ``;
export const isStripeLiveMode = false;
export const stripePubTestKey = ``;
export const stripeSecTestKey = ``;
export const startInterval = (setTime = null, interval) => {
    if (setTime) {
        interval = setInterval(setTime, 1000);
    } else {
        clearInterval(intervalId);
        clearInterval(interval);
    }
};

export const supportKey = `x64qLctV7mZwbBCgkNmkjZEBZpJ2`;

export const tables = {
    users: 'users',
    memories: 'memories'
};

export const tablesSub = {
    ai: 'ai',
    screens: 'screens',
    privateContact: 'privatecontacts',
};

export const customizeAppSections = {
    "HomePage": ["Pray"],
    "PrayNow": ["Background"]
};

export const defaultAppFeatures = [
    {id: 1, value: 'PrayNow'},
];


const encrypt = (text, key) => {
    return JSON.parse(text);
};

const decrypt = (text, key) => {
    return text;
};

export const onSubmitFB = async (obj, tableName, updateKey = null, multipleMode = null, userId = null, replaceAll = true) => {
    let res;
    const db = getDatabase();
    let key = await onFetchEnx();
    if (key) {
        try {
            key = hash(key);
            // console.log(encrypt);
            obj = encrypt(JSON.stringify(obj), key);
            if (obj) {
                if (!updateKey) {
                    if (replaceAll) {
                        if (multipleMode) {
                            res = await push(ref(db, tableName + '/' + (userId?.length > 0 ? userId + '/' : '') + multipleMode), obj);
                        } else {
                            userId = userId ? userId : '';
                            res = await push(ref(db, tableName + '/' + userId), obj);
                        }
                    } else {
                        if (multipleMode) {
                            res = await set(ref(db, tableName + '/' + (userId?.length > 0 ? userId + '/' : '') + multipleMode), obj);
                        } else {
                            userId = userId ? userId : '';
                            res = await set(ref(db, tableName + '/' + userId), obj);
                        }
                    }
                } else {
                    if (replaceAll) {
                        if (multipleMode) {
                            res = await set(ref(db, tableName + '/' + (userId?.length > 0 ? userId + '/' : '') + multipleMode + '/' + updateKey), obj);
                        } else {
                            res = await set(ref(db, tableName + '/' + (userId?.length > 0 ? userId + '/' : '') + updateKey), obj);
                        }
                    } else {
                        if (multipleMode) {
                            res = await update(ref(db, tableName + '/' + (userId?.length > 0 ? userId + '/' : '') + multipleMode + '/' + updateKey), obj);
                        } else {
                            res = await update(ref(db, tableName + '/' + (userId?.length > 0 ? userId + '/' : '') + updateKey), obj);
                        }
                    }
                }
            } else {
                res = {
                    error: true,
                    msg: 'Data is not valid'
                };
            }
        } catch (e) {
            if (e?.code) {
                res = {
                    error: true,
                    msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
                };
            } else {
                res = {
                    error: true,
                    msg: e
                };
            }
        }
    } else {
        res = {
            error: true,
            msg: 'Verification Failed'
        };
    }
    return res;
}

export const onDel = async (tableName, tableKey = null, userId = 'HA') => {
    let res = null;
    const db = getDatabase();
    const path = `${tableName}/${userId}` + (tableKey ? `/${tableKey}` : '');
    try {
        res = await remove(ref(db, path));
    } catch (e) {
        if (e?.code) {
            res = {
                error: true,
                msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
            };
        } else {
            res = {
                error: true,
                msg: e
            };
        }
    }
    return res;
}

export const onDeleteCurrentUser = async () => {
    let res = null;
    try {
        const auth = await getAuth();
        if (auth.currentUser) {
            res = await auth.currentUser.delete();
        } else {
            res = {
                error: true,
                msg: 'Please login again to delete your account'
            };
        }
    } catch (e) {
        if (e?.code) {
            res = {
                error: true,
                msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
            };
        } else {
            res = {
                error: true,
                msg: e
            };
        }
    }
    return res;
}

export const onLoginFB = async (email, password, isReset = false) => {
    if (!validateEmail(email)) {
        return {
            error: true,
            msg: 'Please enter a valid email address'
        };
    }
    if (!isReset && password?.length < 5) {
        return {
            error: true,
            msg: 'Invalid email/password'
        };
    }
    const auth = getAuth();
    try {
        if (isReset) {
            return await sendPasswordResetEmail(auth, email);
        } else {
            return await signInWithEmailAndPassword(auth, email, password);
        }
    } catch (e) {
        return {
            error: true,
            msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
        };
    }
}

export const onUpdatePrivateInfoFB = async (value, isPassword) => {
    if (isPassword) {
        if (!value || value?.length < 5) {
            return {
                error: true,
                msg: 'Invalid password'
            };
        }
    } else {
        if (!validateEmail(value)) {
            return {
                error: true,
                msg: 'Please enter a valid email address'
            };
        }
    }
    const auth = await getAuth();
    try {
        if (isPassword) {
            return await updatePassword(auth.currentUser, value);
        } else {
            return await updateEmail(auth.currentUser, value);
        }
    } catch (e) {
        return {
            error: true,
            msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
        };
    }
}
export const onRegisterFB = async (email, password) => {
    if (!validateEmail(email)) {
        return {
            error: true,
            msg: 'Please enter a valid email address'
        };
    }
    if (password?.length < 5) {
        return {
            error: true,
            msg: 'Invalid email/password'
        };
    }
    const auth = getAuth();
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(res.user);
        return res;
    } catch (e) {
        return {
            error: true,
            msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
        };
    }
}

export const onGetBibleQuoteOfTheDay = async () => {
    const currentDay = new Date().toDateString();
    let isAlready = await AsyncStorage.getItem('bibleQuote');

    if (!isAlready || JSON.parse(isAlready)?.currentDay !== currentDay) {
        const url = `https://bolls.life/get-random-verse/YLT/`;

        try {
            const response = await fetch(url);

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.log('Expected JSON response but got:', contentType);
                return null;
            }

            const quoteOfTheDay = await response.json();

            if (quoteOfTheDay && quoteOfTheDay.text) {
                const transformedQuote = {
                    bookname: quoteOfTheDay.book || 'Unknown',
                    chapter: quoteOfTheDay.chapter,
                    verse: quoteOfTheDay.verse,
                    text: quoteOfTheDay.text
                };

                const bibleQuoteData = {
                    bibleQuote: transformedQuote,
                    currentDay
                };

                await AsyncStorage.setItem('bibleQuote', JSON.stringify(bibleQuoteData));
                return transformedQuote;
            } else {
                console.error('Unexpected response format:', quoteOfTheDay);
                return null;
            }
        } catch (error) {
            console.error('Error fetching or parsing the quote:', error);
            return null;
        }
    } else {
        isAlready = JSON.parse(isAlready);
        return isAlready?.bibleQuote;
    }
};


export const imageUploader = async (imgData) => {
    try {
        if (!imgData) {
            return {
                status: false,
                msg: 'Please upload a valid image'
            };
        }

        const form = new FormData();
        form.append('image', imgData);

        const apis = [
          
        ];
        const apiKey = apis[Math.floor(Math.random() * apis.length)];

        const url = 'https://api.imgbb.com/1/upload?key=' + apiKey;
        const rawResponse = await Promise.race([
            fetch(url, {
                method: 'POST',
                body: form
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), 30000)
            )
        ]);
        if (!rawResponse.ok) {
            throw new Error('HTTP error ' + rawResponse.status);
        }
        const res = await rawResponse.json();
        if (res && res.status === 200 && res.data && res.data.url) {
            const fileId = res.data.url.match(/\/([\w-]+)\//)[1];
            return {
                status: true,
                msg: fileId
            };
        } else {
            throw new Error('Invalid response from the server');
        }
    } catch (error) {
        return {
            status: false,
            msg: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
};

export const onGetOTP = async (mobile, otp) => {
    const apiKey = encodeURIComponent('=');
    const numbers = [mobile];
    const sender = encodeURIComponent('24hrs');
    const message = encodeURIComponent(otp);

    const data = {
        apikey: apiKey,
        numbers: numbers.join(','),
        sender: sender,
        message: message
    };
    const params = new URLSearchParams(data).toString();
    try {
        const response = await fetch('https://api.textlocal.in/send/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        return response.json();
    } catch (e) {
        return {
            error: true,
            msg: e
        }
    }
}

export const onGet = async (tableName, tableKey = null, userID = null) => {
    let res = null;
    let key = await onFetchEnx();
    if (key) {
        const userId = null;
        try {
            const db = getDatabase();
            if (!tableKey) {
                res = await get(ref(db, `${tableName}${userID ? (userID.trim().length > 0 ? '/' + userID : '') : '/' + userId}`));
            } else {
                res = await get(ref(db, `${tableName}/${userID ? userID : userId}/${tableKey}`));
            }
            res = res ? res.val() : null;
            if (res) {
                const data = [];
                if (typeof res === 'object') {
                    if (tableKey) {
                        data.push({
                            key: null,
                            data: res
                        });
                    } else {
                        for (const objKey in res) {
                            if (res[objKey] && typeof res[objKey] === 'object') {
                                data.push({
                                    key: objKey,
                                    data: res[objKey]
                                });
                            }
                        }
                    }
                } else {
                    data.push({
                        key: null,
                        data: res
                    });
                }
                res = data;
            }
            return res;
        } catch (e) {
            if (e?.code) {
                res = {
                    error: true,
                    msg: onErrHandler(e.code ? (e.code.split('/')[1]) : '')
                };
            } else {
                res = {
                    error: true,
                    msg: e
                };
            }
        }
    } else {
        res = {
            error: true,
            msg: 'Verification Failed, come back later...'
        }
    }
    return res;
}

export const checkValueExists = async (tableName, desiredValue, desiredKey) => {
    try {
        const database = getDatabase();
        const usersRef = ref(database, tableName);
        const usernameQuery = query(usersRef, orderByChild(desiredKey), equalTo(desiredValue));
        const usernameSnapshot = await get(usernameQuery);
        const usernameResult = await extractResult(usernameSnapshot);
        if (usernameResult) {
            return usernameResult;
        }
        return null;
    } catch (error) {
        return {
            error: true,
            msg: error.message
        };
    }
};

export const askGPT3 = async (question) => {
    try {

        const apis = [
            // Your API keys
        ]
        const apiKey = apis[Math.floor(Math.random() * apis.length)];
        console.log(apiKey);
        const config = {
            method: "POST",
            url: "https://api.oneai.com/api/v0/pipeline",
            headers: {
                "api-key": apiKey,
                "Content-Type": "application/json",
            },
            data: {
                input: question,
                input_type: "article",
                output_type: "json",
                multilingual: {
                    enabled: true
                },
                steps: [
                    {
                        skill: "gpt"
                    }
                ],
            },
        };
        const response = await fetch(config.url, {
            method: config.method,
            headers: config.headers,
            body: JSON.stringify(config.data),
        });
        return await response.json()
    } catch (error) {
        console.error('Error:', error);
        return {
            error: true,
            msg: 'An error occurred.',
            data: error
        };
    }
}

export const getChatGPTResponse = async (prompt) => {
    try {
        const apiKey = '-EFV4';


        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
        const data = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.log(`---------------------------------ERR-`);
            const responseData = await response.json();
            console.log(JSON.stringify(responseData));
            console.log(`---------------------------------MERROR-`);
            throw new Error('Network response was not ok');
        }

        const res = await response.json();
        if (
            res && res?.candidates &&
            res?.candidates[0]?.content && res?.candidates[0]?.content?.parts &&
            res?.candidates[0]?.content?.parts[0] && res?.candidates[0]?.content?.parts[0]?.text
        ) {
            return res?.candidates[0]?.content?.parts[0]?.text;
        } else {
            console.log(`-AI REQUEST FAILED--`);
            console.log(JSON.stringify(res));
            return {
                error: true,
                msg: 'Error: Unable to process your request.'
            }
        }

        /* const url = `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${apiKey}`;

         const requestBody = {
             prompt: {
                 text: prompt
             }
         };

         const options = {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(requestBody)
         };
         const response = await fetch(url, options);
         const res = await response.json();
         if (res && res?.candidates && res?.candidates[0]?.output) {
             return res?.candidates[0]?.output;
         } else {
             console.log(`-AI REQUEST FAILED--`);
             console.log(res);
             return {
                 error: true,
                 msg: 'Error: Unable to process your request.'
             }
         }*/
        /*const API_KEY = 'sk-';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                temperature: 1.0,
                top_p: 0.7,
                n: 1,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data?.choices[0] ? data?.choices[0]?.message?.content : {
                error: true,
                msg: 'Sorry, we encountered a temporary issue with our AI service. AI is currently unavailable. Please try again later, or contact us for assistance.'
            };
        } else {
            return {
                error: true,
                msg: 'Error: Unable to process your request.'
            }
        }*/
    } catch (error) {
        console.error('Error:', error);
        return {
            error: true,
            msg: 'An error occurred. Please try again later.'
        };
    }
}

export const getUser = async (mode = 'get', data = null) => {
    if (mode === 'get') {
        const currentUser = await AsyncStorage.getItem('user');
        if (!currentUser) {
            Alert.alert('Error', 'User not found');
            return null;
        }
        return JSON.parse(currentUser);
    }
}
export const getBibleContent = async (endPoint = 'GetBooks?language=english') => {
    try {
        const url = `https://iq-bible.p.rapidapi.com/${endPoint}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '',
                'X-RapidAPI-Host': 'iq-bible.p.rapidapi.com'
            }
        };
        const response = await fetch(url, options);
        return await response.json();
        /*const apiKey = '';
        const apiUrl = `https://api.scripture.api.bible/v1/bibles${endPoint ? '/' + endPoint : ''}`;
        const headers = {
            'api-key': apiKey,
        };
        console.log(apiUrl);f
        const response = await fetch(apiUrl, {headers});
        return await response.json();*/
    } catch (error) {
        console.error('Error:', error);
        return {
            error: true,
            msg: 'An error occurred.',
            data: error
        };
    }
}

export const onFetchEnx = async () => {
    return ' ';
}

export const generateUniqueId = (obj) => {
    const objString = JSON.stringify(obj);
    return CryptoES.SHA256(objString).toString();
}

export const hash = (data) => {
    let hash = 0,
        i, chr;
    if (data.length === 0) {
        return hash;
    }
    for (i = 0; i < data.length; i++) {
        chr = data.charCodeAt(i);
        // tslint:disable-next-line:no-bitwise
        hash = ((hash << 5) - hash) + chr;
        // tslint:disable-next-line:no-bitwise
        hash |= 0; // Convert to 32bit integer
    }
    return (data + hash.toString() + data);
}

export const callFunctions = async (obj, functionName, hosting) => {
    try {
        const baseURl = hosting || `t`;
        const url = `${baseURl}/${functionName}?data=${JSON.stringify(obj)}`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        return {
            error: true,
            msg: error
        };
    }
}
export const onPresentAlert = (title, message) => {
    let msg;
    if (typeof message !== 'string') {
        msg = JSON.stringify(message);
    } else {
        msg = message?.toString() || '';
    }
    Alert.alert(
        //title
        title ? title?.toString() : '',
        //body
        msg,);
}
const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
export const onErrHandler = (code) => {
    // console.log(code);
    const authErrors = {
        'admin-restricted-operation': 'This operation is restricted to administrators only.',
        'argument-error': '',
        'app-not-authorized': 'This app, identified by the domain where it\'s hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.',
        'app-not-installed': 'The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.',
        'captcha-check-failed': 'The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.',
        'code-expired': 'The SMS code has expired. Please re-send the verification code to try again.',
        'cordova-not-ready': 'Cordova framework is not ready.',
        'cors-unsupported': 'This browser is not supported.',
        'credential-already-in-use': 'This credential is already associated with a different user account.',
        'custom-token-mismatch': 'The custom token corresponds to a different audience.',
        'requires-recent-login': 'This operation is sensitive and requires recent authentication. Log in again before retrying this request.',
        'dynamic-link-not-activated': 'Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.',
        'email-change-needs-verification': 'Multi-factor users must always have a verified email.',
        'email-already-in-use': 'The email address is already in use by another account.',
        'expired-action-code': 'The action code has expired. ',
        'cancelled-popup-request': 'This operation has been cancelled due to another conflicting popup being opened.',
        'internal-error': 'An internal error has occurred.',
        'invalid-app-credential': 'The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.',
        'invalid-app-id': 'The mobile app identifier is not registed for the current project.',
        'invalid-user-token': 'This user\'s credential isn\'t valid for this project. This can happen if the user\'s token has been tampered with, or if the user isn\'t for the project associated with this API key.',
        'invalid-auth-event': 'An internal error has occurred.',
        'invalid-verification-code': 'The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.',
        'invalid-continue-uri': 'The continue URL provided in the request is invalid.',
        'invalid-cordova-configuration': 'The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.',
        'invalid-custom-token': 'The custom token format is incorrect. Please check the documentation.',
        'invalid-dynamic-link-domain': 'The provided dynamic link domain is not configured or authorized for the current project.',
        'invalid-email': 'The email address is badly formatted.',
        'invalid-api-key': 'Your API key is invalid, please check you have copied it correctly.',
        'invalid-cert-hash': 'The SHA-1 certificate hash provided is invalid.',
        'invalid-credential': 'The supplied auth credential is malformed or has expired.',
        'invalid-message-payload': 'The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.',
        'invalid-multi-factor-session': 'The request does not contain a valid proof of first factor successful sign-in.',
        'invalid-oauth-provider': 'EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.',
        'invalid-oauth-client-id': 'The OAuth client ID provided is either invalid or does not match the specified API key.',
        'unauthorized-domain': 'This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.',
        'invalid-action-code': 'The action code is invalid. This can happen if the code is malformed, expired, or has already been used.',
        'wrong-password': 'The password is invalid or the user does not have a password.',
        'invalid-persistence-type': 'The specified persistence type is invalid. It can only be local, session or none.',
        'invalid-phone-number': 'The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].',
        'invalid-provider-id': 'The specified provider ID is invalid.',
        'invalid-recipient-email': 'The email corresponding to this action failed to send as the provided recipient email address is invalid.',
        'invalid-sender': 'The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.',
        'invalid-verification-id': 'The verification ID used to create the phone auth credential is invalid.',
        'invalid-tenant-id': 'The Auth instance\'s tenant ID is invalid.',
        'multi-factor-info-not-found': 'The user does not have a second factor matching the identifier provided.',
        'multi-factor-auth-required': 'Proof of ownership of a second factor is required to complete sign-in.',
        'missing-android-pkg-name': 'An Android Package Name must be provided if the Android App is required to be installed.',
        'auth-domain-config-required': 'Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.',
        'missing-app-credential': 'The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.',
        'missing-verification-code': 'The phone auth credential was created with an empty SMS verification code.',
        'missing-continue-uri': 'A continue URL must be provided in the request.',
        'missing-iframe-start': 'An internal error has occurred.',
        'missing-ios-bundle-id': 'An iOS Bundle ID must be provided if an App Store ID is provided.',
        'missing-multi-factor-info': 'No second factor identifier is provided.',
        'missing-multi-factor-session': 'The request is missing proof of first factor successful sign-in.',
        'missing-or-invalid-nonce': 'The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.',
        'missing-phone-number': 'To send verification codes, provide a phone number for the recipient.',
        'missing-verification-id': 'The phone auth credential was created with an empty verification ID.',
        'app-deleted': 'This instance of FirebaseApp has been deleted.',
        'account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.',
        'network-request-failed': 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.',
        'no-auth-event': 'An internal error has occurred.',
        'no-such-provider': 'User was not linked to an account with the given provider.',
        'null-user': 'A null user object was provided as the argument for an operation which requires a non-null user object.',
        'operation-not-allowed': 'The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.',
        'operation-not-supported-in-this-environment': 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
        'popup-blocked': 'Unable to establish a connection with the popup. It may have been blocked by the browser.',
        'popup-closed-by-user': 'The popup has been closed by the user before finalizing the operation.',
        'provider-already-linked': 'User can only be linked to one identity for the given provider.',
        'quota-exceeded': 'The project\'s quota for this operation has been exceeded.',
        'redirect-cancelled-by-user': 'The redirect operation has been cancelled by the user before finalizing.',
        'redirect-operation-pending': 'A redirect sign-in operation is already pending.',
        'rejected-credential': 'The request contains malformed or mismatching credentials.',
        'second-factor-already-in-use': 'The second factor is already enrolled on this account.',
        'maximum-second-factor-count-exceeded': 'The maximum allowed number of second factors on a user has been exceeded.',
        'tenant-id-mismatch': 'The provided tenant ID does not match the Auth instance\'s tenant ID',
        timeout: 'The operation has timed out.',
        'user-token-expired': 'The user\'s credential is no longer valid. The user must sign in again.',
        'too-many-requests': 'We have blocked all requests from this device due to unusual activity. Try again later.',
        'unauthorized-continue-uri': 'The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.',
        'unsupported-first-factor': 'Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.',
        'unsupported-persistence-type': 'The current environment does not support the specified persistence type.',
        'unsupported-tenant-operation': 'This operation is not supported in a multi-tenant context.',
        'unverified-email': 'The operation requires a verified email.',
        'user-cancelled': 'The user did not grant your application the permissions it requested.',
        'user-not-found': 'There is no user record corresponding to this identifier. The user may have been deleted.',
        'user-disabled': 'The user account has been disabled by an administrator.',
        'user-mismatch': 'The supplied credentials do not correspond to the previously signed in user.',
        'user-signed-out': '',
        'weak-password': 'The password must be 6 characters long or more.',
        'web-storage-unsupported': 'This browser is not supported or 3rd party cookies and data may be disabled.'
    };
    return authErrors[code];
}

export const jsonApiNet = () => {
    // https://api.jsonstorage.net
    const keys = [
        '8969a471-87b-9f34-b090d396d9bb'
    ];
    return keys[Math.floor(Math.random() * keys.length)];
}

export const onCheckOrdersAndPlans = async (userKey) => {
    try {
        const plans = await onGet(tables.revenue);
        const myOrders = await onGet(tables.orders, null, userKey);
        let features = [];
        const allOrders = myOrders?.map(order => {
            const plan = plans?.find(currentPlan => currentPlan?.key === order?.data?.subscription);
            if (plan && plan?.data?.active) {
                const createdAt = new Date(order?.data?.createdAt);
                let expiration = new Date(order?.data?.createdAt);
                expiration.setDate(expiration.getDate() + plan?.data?.duration);
                expiration = calculateTimeRemaining(expiration);
                if (expiration) {
                    for (let i = 0; i < plan?.data?.features?.length; i++) {
                        const feature = plan?.data?.features[i];
                        if (feature) {
                            features.push(feature);
                        }
                    }
                    return {
                        ...order,
                        data: {
                            ...order.data,
                            plan: plan.data,
                            createdAt,
                            expiration
                        }
                    };
                }
            }
            return null;
        }).filter(order => order !== null);
        features = features.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.id === obj.id && t.value === obj.value
                ))
        );
        return {
            allOrders: allOrders || [],
            plans: plans || [],
            features: features.length > 0 ? features : [{"id": 1, "value": "PrayNow"}]
        };
    } catch (error) {
        return {allOrders: [], plans: [], features: [{"id": 1, "value": "PrayNow"}]};
    }
};


/*export const onCheckOrdersAndPlans = async (userKey) => {
    try {
        const plans = await onGet(tables.revenue);
        const myOrders = await onGet(tables.orders, null, userKey);
        let features = [];
        const allOrders = myOrders?.map(order => {
            const plan = plans?.find(currentPlan => currentPlan?.key === order?.data?.subscription);
            if (plan && plan?.data?.active) {
                const createdAt = new Date(order?.data?.createdAt);
                let expiration = new Date(order?.data?.createdAt);
                expiration.setDate(expiration.getDate() + plan?.data?.duration);
                expiration = calculateTimeRemaining(expiration);
                console.log(`-expiration---------duration-`)
                console.log(expiration)
                if (expiration) {
                    for (let i = 0; i < plan?.data?.features?.length; i++) {
                        const feature = plan?.data?.features[i];
                        if (feature) {
                            features.push(feature);
                        }
                    }
                }
                return {
                    ...order,
                    data: {
                        ...order.data,
                        plan: plan.data,
                        createdAt,
                        expiration
                    }
                };
            }
            return null;
        }).filter(Boolean);
        features = features.filter((obj, index, self) =>
                index === self.findIndex((t) => (
                    t.id === obj.id && t.value === obj.value
                ))
        );
        return {allOrders, plans, features: features?.length > 0 ? features : [{"id": 1, "value": "PrayNow"}]};
    } catch (error) {
        return {allOrders: [], plans: [], features: []};
    }
};*/


const calculateTimeRemaining = (futureDate) => {
    const difference = futureDate - new Date();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} days left`;
    } else if (days === 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        if (hours > 0) {
            return `${hours} hours left`;
        } else if (minutes > 0) {
            return `${minutes} minutes left`;
        } else {
            return 'Less than a minute left';
        }
    } else {
        return null;
    }
}

export const onGetUserNotificationToken = async (userKey) => {
    const acc = await onGet(tables.notifications, null, userKey);
    if (acc[0] && acc[0]?.data?.token) {
        return acc[0]?.data?.token;
    }
    return;
}

export const getUniqueID = (id1, id2) => {
    const sortedIDs = [id1, id2].sort();
    return sortedIDs.join('');
}

export const handleConfirmation = async (title, msg) => {
    return new Promise((resolve, reject) => {
        Alert.alert(
            title || 'Are you sure',
            msg || 'This action cannot be undone. Are you sure you want to proceed?',
            [
                {
                    text: 'Cancel',
                    onPress: () => resolve(false),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => resolve(true)
                }
            ],
            {cancelable: false}
        );
    });
};

export const onReadTextUsingAI = async (text: string) => {
    try {
        const deepgramApiKey = '';
        const url = 'https://api.deepgram.com/v1/speak?model=aura-asteria-en';
        const data = {
            text
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${deepgramApiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        /*const res = await response.arrayBuffer();
        const blob = new Blob([res], {type: 'audio/mpeg'}*/
        console.log(`--------------------------onReadTextUsingAI-`);

        const blobData = response._bodyBlob._data;
        const blob = new Blob([blobData], {type: response.headers.map['content-type']});

        console.log({
            arrayBuffer: blobData.arrayBuffer,
            arrayBuffer2: blob.arrayBuffer,
        })

        return 'blobUrl';


    } catch (error) {
        console.error('Error:', error);
    }
}

export const generateAudio = async (text) => {
    try {
        const url = `https://api.deepgram.com/v1/speak?model=aura-asteria-en`;
        const data = {
            text
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token b9a9f356187e8962977a0b3f281029469faad6dc`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blobData = response._bodyBlob._data;
        const blob = new Blob([blobData], {type: response.headers.map['content-type']});
        const base64Data = await blobToBase64(blob);
        console.log(`----------------------base64Data--`);
        console.log(blobData);
        console.log(base64Data);

    } catch (error) {
        console.error('Error:', error);
        return error;
    }
};

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Remove the data URL part
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
        return "Good morning!";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon!";
    } else if (hour >= 17 && hour < 20) {
        return "Good evening!";
    } else if (hour >= 20 && hour < 24) {
        return "Good night!";
    } else {
        return "Hello!";
    }

}

const extractResult = async (snapshot) => {
    const selUser = await snapshot.val();
    if (selUser) {
        let totalData = [];
        for (const key in selUser) {
            totalData.push({...selUser[key], key});
        }
        return totalData?.length > 1 ? totalData : totalData[0]
    }
    return null;
}
