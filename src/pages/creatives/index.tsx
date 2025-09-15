import Text from "@/components/atoms/CustomText";
import { Box, Grid, Pagination, Skeleton, useMediaQuery } from "@mui/material";
import CreativeCard from "@/components/cards/CreativeProfileCard";
import { useViewCreativesHook } from "@/hooks/creatives/viewCreativesHook";
import { useModal } from "@/hooks/utils.hook";
import { CreativeProfileDto } from "../../models/dtos/CreativeProfileDto";
import SeoHead from "../../components/atoms/SeoHead";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import InputField from "@/components/atoms/Input";
import CustomModal from "@/components/modals/CustomModal";
import CustomCreativesFilter, {
  ICreativeFilter,
} from "@/components/atoms/CustomCreativesFilter";
import DashboardLayout from "@/components/atoms/DashboardLayout";

const ViewCreativesPage = () => {
  const router = useRouter();
  const {
    navigate,
    applyFilter,
    loaded,
    pagination,
    creatives,
    setSearchTerm,
  } = useViewCreativesHook();
  const { open, setOpen } = useModal();
  const { userDetails } = useAuth();
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <>
      <SeoHead title="Creatives" />
      <DashboardLayout>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={"33px"}
          maxWidth={"1500px"}
          mx={"auto"}
          px={3}
          mt={4}
        >
          <Box
            alignSelf={"left"}
            sx={{
              alignItems: "left",
              borderRadius: "8px",
              width: isMobile ? "80%" : "50%",
              cursor: "pointer",
            }}
          >
            <InputField
              placeholder="Search by name..."
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              icon={<SearchIcon width={24} height={24} />}
            />
          </Box>

          <Box sx={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
            <img
              src="/assets/icons/filter-pink.svg"
              alt="image"
              width={30}
              height={30}
            />
          </Box>
        </Box>

        {loaded ? (
          <Box
            sx={{ paddingBottom: "100px" }}
            maxWidth={"1500px"}
            mx={"auto"}
            px={3}
            mt={3}
          >
            <Grid container spacing={3}>
              {[...Array(8)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    height={"100%"}
                    width={"100%"}
                    sx={{ aspectRatio: 1 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <>
            <Box
              sx={{ paddingBottom: "100px" }}
              maxWidth={"1500px"}
              mx={"auto"}
              px={3}
            >
              <Box mt={3}>
                <Grid container spacing={3}>
                  {creatives &&
                    creatives.length > 0 &&
                    creatives.map(
                      (creative: CreativeProfileDto, index: number) => {
                        return (
                          <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                            <CreativeCard
                              creativeData={creative}
                              onClick={() =>
                                navigate(
                                  userDetails?.userId === creative.userId
                                    ? `/profile/${creative.userId}`
                                    : `/creatives/${creative.userId}`
                                )
                              }
                            />
                          </Grid>
                        );
                      }
                    )}
                  {creatives && creatives.length < 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "500px",
                        height: "500px",
                        margin: "auto",
                        marginTop: "150px",
                      }}
                    >
                      <img
                        src="/assets/vectors/search.png"
                        alt="image"
                        width={300}
                        height={300}
                        style={{ objectPosition: "center" }}
                      />
                      <Text size={15} weight={400} sx={{ mt: 1 }} center>
                        No creatives found with the current filter. Please try
                        other settings.
                      </Text>
                    </Box>
                  )}
                </Grid>
                <Box px={3}>
                  {creatives && creatives.length > 0 && (
                    <Box
                      display={"flex"}
                      justifyContent={"flex-end"}
                      mt={"30px"}
                    >
                      <Pagination
                        count={Math.ceil(Number(pagination?.pageSize || 1) / 8)}
                        defaultPage={1}
                        siblingCount={0}
                        boundaryCount={0}
                        page={Number(pagination?.page || 1)}
                        onChange={(event, pageNumber) =>
                          router.push(`/creatives?page=${pageNumber}`)
                        }
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <CustomModal
                width="600px"
                open={open}
                setOpen={setOpen}
                closeOnOverlayClick={true}
              >
                <CustomCreativesFilter
                  setFilter={(data: ICreativeFilter) => applyFilter(data)}
                  setOpen={() => setOpen(false)}
                />
              </CustomModal>
            </Box>
          </>
        )}
      </DashboardLayout>
    </>
  );
};

export default ViewCreativesPage;
