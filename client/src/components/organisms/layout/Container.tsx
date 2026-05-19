interface ContainerProps {
  variant?: "fluid" | "tight" | "default";
  className?: string;
  children: React.ReactNode;
}

function Container({
  variant = "default",
  className = "",
  children,
}: ContainerProps) {
  // Map variant strings to your CSS modifier classes
  const variantClass =
    variant === "fluid"
      ? "container--fluid"
      : variant === "tight"
        ? "container--tight"
        : "";

  return (
    <div className={`container ${variantClass} ${className}`}>{children}</div>
  );
}
export default Container;
