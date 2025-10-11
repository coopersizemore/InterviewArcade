import { useNavigate } from "react-router-dom";
import GlowingCard from './GlowingCard';
import './StartPage.css'

function StartPage() {
    const navigate = useNavigate();
    
    // Takes the user to the interview page
    function cardClick() {
        navigate('/interview');
    }

    // function cardClick() {
    //     console.log("Hello World!")
    // }

    return (
        // 1 Question, 5 Minutes, Happy Practicing!
        <div className="start-page-container">
            <h2>Information</h2>
            <ul className="information-list">
                <li>1 Question</li>
                <li>5 Minutes</li>
                <li>Happy Practicing!</li>
            </ul>
            <GlowingCard onClick={cardClick}/>
        </div>
    )
}

export default StartPage;
