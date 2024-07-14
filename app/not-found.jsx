"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error () {

    useEffect(() => {

        document.title = "Error 404 - Not founded page !";

    }, []);

    return (

        <div className="flex justify-center items-center flex-wrap error-page no-select">

            <div className="image flex layer-div">
                <img src="/media/public/error.png"/>
            </div>

            <div>

                <h1>Oops...</h1>

                <p>
                    <span>We can't find that page.</span><br/>
                    <span>Let's get you back on the right track.</span><br/>
                    <span>Try another search, or click below.</span>
                </p>

                <Link href="/" className="btn btn-primary btn-badge">Take me home</Link>
                
            </div>

        </div>

    )

}
