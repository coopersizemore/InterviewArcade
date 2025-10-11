import { useNavigate } from "react-router-dom";
import GlowingCard from './GlowingCard';

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
        <div className="home-page-container">
            <GlowingCard onClick={cardClick}/>
        </div>
    )
}

export default StartPage;
