import propTypes from "prop-types";
const Footer = ({ caption, username }) => {
  return (
    <div className="p-4 pt-2 pb-1 font-stix text-lg">
      <span className="mr-1 font-bold">{username}</span>
      <span>{caption}</span>
    </div>
  );
};

Footer.propTypes = {
  caption: propTypes.string.isRequired,
  username: propTypes.string.isRequired,
};
export default Footer;
