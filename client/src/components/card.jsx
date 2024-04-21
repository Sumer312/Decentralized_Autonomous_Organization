const Card = (props) => {
  return (
    <div class="card h-48 w-96 max-w-xl bg-primary cursor-pointer shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        <p>{props.description.substring(0, 20)}</p>
        <div class="card-actions justify-end">
        </div>
      </div>
    </div>
  )
}
export default Card
