import './styles.scss';

const Chip = ({
  children,
  label = 'unlabeled',
  style,
}) => (
  <figure className="chip" style={style}>
    {children || label}
  </figure>
);

export default Chip;
