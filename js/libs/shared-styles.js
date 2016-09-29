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
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                WebkitAnimation: 'load8 0.7s infinite linear',
                animation: 'load8 0.7s infinite linear'
            },

            '.small': {
                width: '16px',
                height: '16px',
            }
        },

        '.loaderOuter.active': {
            display: 'flex'
        }
    },

    shadeColor: (color, percent) => {
        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;  
        G = (G<255)?G:255;  
        B = (B<255)?B:255;  

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
    }
}