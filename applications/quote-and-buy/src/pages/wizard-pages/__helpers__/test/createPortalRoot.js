export default function createPortalRoot() {
    if (!global.document.getElementById('portal-root')) {
        const portalRoot = global.document.createElement('div');
        portalRoot.innerHTML = '';
        portalRoot.setAttribute('id', 'portal-root');
        const body = global.document.querySelector('body');
        body.appendChild(portalRoot);
    }
}
