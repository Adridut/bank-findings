import ecb_logo from "../images/ecb.jpg";

export default function Index() {
    return (
      <div className="container">
        <img src={ecb_logo} alt="ECB Logo" />
        <div>Select banks and their findings from the left panel or create new ones!</div>
      </div>
    );
  }