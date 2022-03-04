import OAuthUtil from './utils/OAuthUtil';
import jwtHelper from './utils/JwtHelper';
import AuthenticationServiceFactory from './AuthenticationServiceFactory';

// EXPORT
function createOAuthService(oAuth) {
    const oAuthUtil = OAuthUtil(
        {
            ...oAuth,
            onRefreshError: AuthenticationServiceFactory(oAuth).logout
        }
    );
    return {
        refreshAccessToken: () => {
            oAuthUtil.removeTokens();
            return oAuthUtil.requestAccessToken();
        },

        get accessToken() {
            return oAuthUtil.waitTokensSet()
                .then((tokens) => {
                    return tokens.accessToken;
                });
        },

        get accessTokenDecoded() {
            return oAuthUtil.waitTokensSet()
                .then((tokens) => {
                    return jwtHelper.decodeToken(tokens.accessToken);
                });
        },

        get grantedAuthorities() {
            return oAuthUtil.waitTokensSet()
                .then((tokens) => {
                    const isAuthenticated = tokens.accessToken
                        && !jwtHelper.isTokenExpired(tokens.accessToken);

                    if (!isAuthenticated) {
                        return [];
                    }

                    const scopes = jwtHelper.decodeToken(tokens.accessToken).scope;

                    const scopeAuthorities = oAuthUtil.filterScopeAuthorities(scopes);

                    return scopeAuthorities.map((scope) => {
                        const authorityRegex = /^guidewire\.edge\.(.*)\.(.*)\.(.*)$/g;
                        const match = authorityRegex.exec(scope);
                        return {
                            authorityType: match[1].toUpperCase(),
                            value: match[2],
                            authorityLevel: match[3]
                        };
                    });
                }).catch(() => {
                    return [];
                });
        }
    };
}

export default createOAuthService;
