import './FeedbackPage.css'; // We can reuse the same CSS file

function FeedbackColumn({ title, reviewData }) {
  if (!reviewData) return null;

  return (
    <div className="feedback-column">
      <h2>{title}</h2>
      <div className="score-badge">
        Score: {reviewData.score}
        <span className="invader-icon">👾</span>
      </div>

      <div className="feedback-section">
        <h3>Strengths</h3>
        <ul>
          {reviewData.strengths_list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{reviewData.strengths_description}</p>
      </div>

      <div className="feedback-section">
        <h3>Areas for Improvement</h3>
        <ul>
          {reviewData.improvements_list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p>{reviewData.improvements_description}</p>
      </div>
    </div>
  );
}

export default FeedbackColumn;