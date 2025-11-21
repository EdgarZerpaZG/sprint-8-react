import { Link } from "react-router-dom";
import Facebook from "../../assets/icon-facebook.svg";
import Twitter from "../../assets/icon-twitter.svg";

export default function Top() {

    return (
        <>
            <div className="relative flex justify-between">
                <ul className="flex">
                    <li className="px-2 py-2">
                        <Link to="https://www.facebook.com" target="_blank">
                            <img src={Facebook} alt="Facebook" />
                        </Link>
                    </li>
                    <li className="px-2 py-2">
                        <Link to="https://www.twitter.com" target="_blank">
                            <img src={Twitter} alt="Twitter" />
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}