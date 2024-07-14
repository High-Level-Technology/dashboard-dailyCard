"use client";
import { Fragment, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { usePopper } from 'react-popper';

const Dropdown = (props, forwardedRef) => {
    
    useImperativeHandle(forwardedRef, () => ({ close() { setVisibility(false); } }));
    const [visibility, setVisibility] = useState(false);
    const referenceRef = useRef();
    const popperRef = useRef();

    const { styles, attributes } = usePopper(referenceRef.current, popperRef.current, {
        placement: props.placement || 'bottom-end',
        modifiers: [{name: 'offset', options: {offset: props.offset || [0]}}],
    });
    useEffect(() => {

        document.addEventListener('mousedown', function(e){

            try{ if ( referenceRef.current.contains(e.target) || popperRef.current.contains(e.target) ) return; } catch(err) {}

            setVisibility(false);

        });

    }, []);

    return (

        <Fragment>

            <button ref={referenceRef} type="button" className={props.btnClassName} onClick={() => setVisibility(!visibility)}>

                {props.button}

            </button>

            <div ref={popperRef} style={styles.popper} {...attributes.popper} className="z-50" onClick={() => setVisibility(!visibility)}>

                {visibility && props.children}
                
            </div>

        </Fragment>

    );

};

export default forwardRef(Dropdown);
