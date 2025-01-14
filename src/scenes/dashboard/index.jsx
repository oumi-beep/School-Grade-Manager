import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Header,
  StatBox,
  LineChart,
  ProgressCircle,
  BarChart,
  GeographyChart,
} from "../../components";
import {
  DownloadOutlined,
  Email,
  PersonAdd,
  PointOfSale,
  Traffic,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const studentDataMorocco = [
    { region: "Casablanca-Settat", value: 1200 },
    { region: "Rabat-Salé-Kénitra", value: 850 },
    { region: "Marrakech-Safi", value: 700 },
    { region: "Fès-Meknès", value: 500 },
    { region: "Tangier-Tétouan-Al Hoceima", value: 400 },
    { region: "Souss-Massa", value: 350 },
    { region: "Oriental", value: 300 },
    { region: "Béni Mellal-Khénifra", value: 200 },
    { region: "Drâa-Tafilalet", value: 150 },
    { region: "Guelmim-Oued Noun", value: 100 },
  ];
  
  
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between">
        <Header title="Travel Dashboard" subtitle="Welcome to your travel insights" />
        {!isXsDevices && (
          <Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#5347CE",
                color: "#fcfcfc",
                fontSize: isMdDevices ? "14px" : "10px",
                fontWeight: "bold",
                p: "10px 20px",
                mt: "18px",
                transition: ".3s ease",
                ":hover": {
                  bgcolor: colors.blueAccent[800],
                },
              }}
              startIcon={<DownloadOutlined />}
            >
              DOWNLOAD REPORTS
            </Button>
          </Box>
        )}
      </Box>

        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
                ? "repeat(6, 1fr)"
                : "repeat(3, 1fr)"
          }
          gridAutoRows="140px"
          gap="20px"
        >
        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="42"
            subtitle="Professors"
            progress="0.80"
            increase="+10%"
            icon={<PersonAdd sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="528"
            subtitle="Students"
            progress="0.90"
            increase="+5%"
            icon={<PersonAdd sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="36"
            subtitle="Courses"
            progress="0.70"
            increase="+12%"
            icon={<PointOfSale sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="120"
            subtitle="Active Quizzes"
            progress="0.65"
            increase="+20%"
            icon={<Traffic sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        {/* Line Chart */}
        <Box
          gridColumn={isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
        >
          <Box mt="25px" px="30px" display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.gray[100]}>
                Student Enrollment
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={colors.greenAccent[500]}>
                528 Students
              </Typography>
            </Box>
            <IconButton>
              <DownloadOutlined sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
            </IconButton>
          </Box>
          <Box height="250px" mt="-20px">
            <LineChart
              isDashboard={true}
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                datasets: [
                  {
                    label: "Enrollment",
                    data: [100, 150, 200, 180, 220, 300, 528],
                    borderColor: colors.greenAccent[500],
                    fill: true,
                    backgroundColor: "rgba(72, 192, 192, 0.2)",
                  },
                ],
              }}
            />
          </Box>
        </Box>


        {/* Geography Chart */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
          padding="30px"
        >
          <Typography variant="h5" fontWeight="600" mb="15px">
            Student Distribution in Morocco
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="center" height="200px">
            <GeographyChart isDashboard={true} data={studentDataMorocco} />
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

export default Dashboard;
