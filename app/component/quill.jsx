"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(
    async () => { 
        const { default: RQ } = await import("react-quill");
        return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
);
const modules = {
    toolbar: [
        [{'font': []}],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, 
        {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ]
};

export default function Quill ({ value, onChange, className }) {
    
    return <ReactQuill modules={modules} className={className} value={value} onChange={onChange}/>;

};
