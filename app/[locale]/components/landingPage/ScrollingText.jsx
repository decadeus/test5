export default function ScrollingText() {
  const announcements = [
    "Eiffage",
    "Bouygues",
    "Marvipol",
    "Ronson",
    "Develia",
    "Archicom",
    "Budlex",
    "Profbud",
    "Vinci",
    "Procivis",
    "Icade",
    "Bassac",
  ];

  return (
    <div className="scrolling-text-container pt-24">
      <div
        className="scrolling-text-inner"
        style={{ "--marquee-speed": "50s" }}
        role="marquee"
      >
        <div className="scrolling-text">
          {Array(5)
            .fill(announcements)
            .flat()
            .map((text, index) => (
              <div key={index} className="scrolling-text-item">
                {text}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
