function Avatar({
  name = "Deepa Singh",
  size = "md",
}) {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default Avatar;
