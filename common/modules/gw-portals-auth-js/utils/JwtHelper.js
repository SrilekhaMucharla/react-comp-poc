import IdTokenVerifier from 'idtoken-verifier';

function urlBase64Decode(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
            break;
        }
        case 2: {
            output += '==';
            break;
        }
        case 3: {
            output += '=';
            break;
        }
        default: {
            throw new Error('Illegal base64url string!');
        }
    }
    return window.decodeURIComponent(escape(window.atob(output))); // polyfill https://github.com/davidchambers/Base64.js
}

function decodeToken(token) {
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error('JWT must have 3 parts');
    }

    const decoded = urlBase64Decode(parts[1]);
    if (!decoded) {
        throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
}

function getTokenExpirationDate(token) {
    const decoded = decodeToken(token);

    if (typeof decoded.exp === 'undefined') {
        return null;
    }
    const d = new Date(0); // The 0 here is the key, which sets the date to the epoch
    d.setUTCSeconds(decoded.exp);
    return d;
}

// For use with frontend id_tokens only. Not to be used to determine access
function isValidIdToken(idToken, nonce, authConfig) {
    // jwksUri defaults to ${id_token.iss}/.well-known/jwks.json
    const verifier = new IdTokenVerifier({
        issuer: authConfig.issuer,
        audience: authConfig.clientId
    });

    return new Promise((resolve, reject) => {
        verifier.verify(idToken, nonce, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
}

export default {
    decodeToken,
    isValidIdToken,

    isTokenExpired: (token, offsetSeconds = 0) => {
        const d = getTokenExpirationDate(token);
        if (d === null) {
            return false;
        }
        // Token expired?
        return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
};
