const Notification = ({ message, className}) => {
  console.log(`In Notification ${message} ${className}`);
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification