const FeatureParentComponent = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <div
      className={`flex flex-col lg:flex-row items-center container md:my-[186px] my-[40px] px-6 md:gap-[70px] gap-[40px] ${className}`}
      id={id ?? "#"}
    >
      {children}
    </div>
  );
};

export default FeatureParentComponent;
