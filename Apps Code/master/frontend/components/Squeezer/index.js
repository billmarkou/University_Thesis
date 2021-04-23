import css from "./styles.scss"

export default function Squeezer(props) {
  return <div className={`${props.className} ${css.squeeze}`}> {props.children} </div>
}