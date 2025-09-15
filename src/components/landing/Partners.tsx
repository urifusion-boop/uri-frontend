import { Box, Grid } from "@mui/material";

const TrustedPartners: React.FC = () => {
  const partners = [
    {
      name: "Microsoft",
      img: "/assets/images/landing/microsoft.png",
      height: "50px",
    },
    {
      name: "Alx Nigeria",
      img: "/assets/icons/alx.svg",
      height: "30px",
    },
  ];

  return (
    <Box>
      <div className="container mx-6 my-[80px] md:my-[170px]">
        <h2 className="text-[32px] md:text-[48px] font-bold text-center font-urbanist">
          Our Trusted{" "}
          <span className="text-[32px] text-[#CD1B78] md:text-[48px] font-bold inline">
            Partners
          </span>
        </h2>
        <p className="max-w-[770px] mx-auto text-center text-[#080808] text-lg md:text-[24px] mt-1 font-urbanist font-medium leading-snug px-1">
          Join companies already trusting our software for seamless
          collaboration and boosted productivity. Experience it today!
        </p>

        {/* Partner Logos */}
        <div className="flex justify-center mt-8 items-center gap-4">
          {partners.map((partner, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <img
                src={partner.img}
                alt={partner.name}
                style={{
                  height: partner?.height ?? "91px",
                  width: "auto",
                }}
              />
            </Grid>
          ))}
        </div>
      </div>
    </Box>
  );
};

export default TrustedPartners;
