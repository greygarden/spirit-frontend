// -------------------------------------------------------------
// This file contains some shared styles for use with recess.
// -------------------------------------------------------------

export default {
    loader: {
        '.loaderOuter': {
            position: 'absolute',
            display: 'none',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'inherit',
            zIndex: '1',

            '.loader': {
                fontSize: '10px',
                position: 'relative',
                textIndent: '9999em',
                border: '2px solid rgba(120, 120, 120, 0.2)',
                borderLeft: '2px solid #999',
                transform: 'translateZ(0)',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                WebkitAnimation: 'load8 0.7s infinite linear',
                animation: 'load8 0.7s infinite linear'
            }
        },

        '.loaderOuter.active': {
            display: 'flex'
        }
    }
}