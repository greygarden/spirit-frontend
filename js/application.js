// -------------------------------------------------------------
// This file starts up the Spirit single page application.
// -------------------------------------------------------------

import router from './application/router.jsx'
import attachFastClick from 'fastclick'

setTimeout(() => {
    // Start the router running
    router.run();
    // Attach fastclick for better mobile touch support
    attachFastClick(document.body, {});
});