import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import gsap from 'gsap';
import './HomePage.css'

class RadioButtonEffect {
  constructor(radioBtnGroups) {
    this.previousRadioBtn = null;

    radioBtnGroups.forEach((group) => {
      const radioBtn = gsap.utils.selector(group)("input[type='radio']")[0];
      const nodes = this.getNodes(radioBtn);

      radioBtn.addEventListener("change", () => {
        if (this.previousRadioBtn && this.previousRadioBtn !== radioBtn) {
          this.changeEffect(this.getNodes(this.previousRadioBtn), false);
        }

        this.changeEffect(nodes, true);
        this.previousRadioBtn = radioBtn;
      });
    });
  }

  getNodes(radioBtn) {
    const container = radioBtn.closest(".radio-btn-group");
    return gsap.utils.shuffle(gsap.utils.selector(container)("rect"));
  }

  changeEffect(nodes, isChecked) {
    gsap.to(nodes, {
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      x: isChecked ? "100%" : "-100%",
      stagger: 0.01,
      overwrite: true
    });

    gsap.fromTo(
      nodes,
      {
        fill: "#0c79f7"
      },
      {
        fill: "#76b3fa",
        duration: 0.1,
        ease: "elastic.out(1, 0.3)",
        repeat: -1
      }
    );

    if (isChecked) {
      const randomNodes = nodes.slice(0, 5);
      gsap.to(randomNodes, {
        duration: 0.7,
        ease: "elastic.out(1, 0.1)",
        x: "100%",
        stagger: 0.1,
        repeatDelay: 1.5,
        repeat: -1
      });
    }
  }
}

function HomePage() {
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    useEffect(() => {
        const radioBtnGroups = document.querySelectorAll(".radio-btn-group");
        if (radioBtnGroups.length > 0) {
            new RadioButtonEffect(radioBtnGroups);
        }
        document.addEventListener("DOMContentLoaded", () => {
            const radioBtnGroups = document.querySelectorAll(".radio-btn-group");
            new RadioButtonEffect(radioBtnGroups);
        });
    }, []);

    function handleConfirmClick() {
      console.log(selectedOption)
      if (selectedOption === 'company') {
        // console.log("Navigating to company page...");
        navigate('/companies');
      } else if (selectedOption === 'random') {
        // console.log("Navigating to start page with random option...");
        navigate('/start', { state: { random: true, count: 1 } });
      }
    }

    return (
        <div className="home-page">
            <h2>Select an option and hit confirm</h2>

            <div className="container">
                <div className="radio-btn-group">
                    <input type="radio" name="stagger-radio-group" value="company" 
                      checked={selectedOption === 'company'} onChange={handleOptionChange}id="input-one" />
                    <label htmlFor="input-one">
                    <span>Company</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <g className="left">
                        <rect x="-100%" y="0" width="100%" height="2" />
                        <rect x="-100%" y="2" width="100%" height="2" />
                        <rect x="-100%" y="4" width="100%" height="2" />
                        <rect x="-100%" y="6" width="100%" height="2" />
                        <rect x="-100%" y="8" width="100%" height="2" />
                        <rect x="-100%" y="10" width="100%" height="2" />
                        <rect x="-100%" y="12" width="100%" height="2" />
                        <rect x="-100%" y="14" width="100%" height="2" />
                        <rect x="-100%" y="16" width="100%" height="2" />
                        <rect x="-100%" y="18" width="100%" height="2" />
                        <rect x="-100%" y="20" width="100%" height="2" />
                        <rect x="-100%" y="22" width="100%" height="2" />
                        <rect x="-100%" y="24" width="100%" height="2" />
                        <rect x="-100%" y="26" width="100%" height="2" />
                        <rect x="-100%" y="28" width="100%" height="2" />
                        <rect x="-100%" y="30" width="100%" height="2" />
                        <rect x="-100%" y="32" width="100%" height="2" />
                        <rect x="-100%" y="34" width="100%" height="2" />
                        <rect x="-100%" y="36" width="100%" height="2" />
                        <rect x="-100%" y="38" width="100%" height="2" />
                        <rect x="-100%" y="40" width="100%" height="2" />
                        <rect x="-100%" y="42" width="100%" height="2" />
                        <rect x="-100%" y="44" width="100%" height="2" />
                        <rect x="-100%" y="46" width="100%" height="2" />
                        <rect x="-100%" y="48" width="100%" height="2" />
                        </g>
                    </svg>
                    </label>
                </div>

                <div className="radio-btn-group">
                    <input type="radio" name="stagger-radio-group" value="random" 
                      checked={selectedOption === 'random'} onChange={handleOptionChange} id="input-two" />
                    <label htmlFor="input-two">
                    <span>Random</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <g className="left">
                        <rect x="-100%" y="0" width="100%" height="2" />
                        <rect x="-100%" y="2" width="100%" height="2" />
                        <rect x="-100%" y="4" width="100%" height="2" />
                        <rect x="-100%" y="6" width="100%" height="2" />
                        <rect x="-100%" y="8" width="100%" height="2" />
                        <rect x="-100%" y="10" width="100%" height="2" />
                        <rect x="-100%" y="12" width="100%" height="2" />
                        <rect x="-100%" y="14" width="100%" height="2" />
                        <rect x="-100%" y="16" width="100%" height="2" />
                        <rect x="-100%" y="18" width="100%" height="2" />
                        <rect x="-100%" y="20" width="100%" height="2" />
                        <rect x="-100%" y="22" width="100%" height="2" />
                        <rect x="-100%" y="24" width="100%" height="2" />
                        <rect x="-100%" y="26" width="100%" height="2" />
                        <rect x="-100%" y="28" width="100%" height="2" />
                        <rect x="-100%" y="30" width="100%" height="2" />
                        <rect x="-100%" y="32" width="100%" height="2" />
                        <rect x="-100%" y="34" width="100%" height="2" />
                        <rect x="-100%" y="36" width="100%" height="2" />
                        <rect x="-100%" y="38" width="100%" height="2" />
                        <rect x="-100%" y="40" width="100%" height="2" />
                        <rect x="-100%" y="42" width="100%" height="2" />
                        <rect x="-100%" y="44" width="100%" height="2" />
                        <rect x="-100%" y="46" width="100%" height="2" />
                        <rect x="-100%" y="48" width="100%" height="2" />
                        </g>
                    </svg>
                    </label>
                </div>

                <div className="radio-btn-group">
                    <input type="radio" name="stagger-radio-group" value="category"  
                      checked={selectedOption === 'category'} onChange={handleOptionChange} id="input-three" />
                    <label htmlFor="input-three">
                    <span>Category</span>
                    <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <g className="left">
                        <rect x="-100%" y="0" width="100%" height="2" />
                        <rect x="-100%" y="2" width="100%" height="2" />
                        <rect x="-100%" y="4" width="100%" height="2" />
                        <rect x="-100%" y="6" width="100%" height="2" />
                        <rect x="-100%" y="8" width="100%" height="2" />
                        <rect x="-100%" y="10" width="100%" height="2" />
                        <rect x="-100%" y="12" width="100%" height="2" />
                        <rect x="-100%" y="14" width="100%" height="2" />
                        <rect x="-100%" y="16" width="100%" height="2" />
                        <rect x="-100%" y="18" width="100%" height="2" />
                        <rect x="-100%" y="20" width="100%" height="2" />
                        <rect x="-100%" y="22" width="100%" height="2" />
                        <rect x="-100%" y="24" width="100%" height="2" />
                        <rect x="-100%" y="26" width="100%" height="2" />
                        <rect x="-100%" y="28" width="100%" height="2" />
                        <rect x="-100%" y="30" width="100%" height="2" />
                        <rect x="-100%" y="32" width="100%" height="2" />
                        <rect x="-100%" y="34" width="100%" height="2" />
                        <rect x="-100%" y="36" width="100%" height="2" />
                        <rect x="-100%" y="38" width="100%" height="2" />
                        <rect x="-100%" y="40" width="100%" height="2" />
                        <rect x="-100%" y="42" width="100%" height="2" />
                        <rect x="-100%" y="44" width="100%" height="2" />
                        <rect x="-100%" y="46" width="100%" height="2" />
                        <rect x="-100%" y="48" width="100%" height="2" />
                        </g>
                    </svg>
                    </label>
                </div>
            </div>

            <div className="confirm-button-container">
                <button onClick={handleConfirmClick} className="confirm-button">Confirm</button>
            </div>
        </div>
    )
}

export default HomePage;
