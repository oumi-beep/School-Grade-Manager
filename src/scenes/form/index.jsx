import { Box, useMediaQuery, useTheme } from "@mui/material";

function Form() {
  const theme = useTheme();
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" mb="20px">
        {/* Place for Header or Other Top Content */}
      </Box>

      {/* GRID STRUCTURE */}
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
        {/* Row 1 */}
        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
        <Box
          gridColumn="span 3"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>

        {/* Row 2 */}
        <Box
          gridColumn={isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>

        {/* Additional Boxes for Row 3 */}
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
        <Box
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          bgcolor="#eef5f9"
          borderRadius="15px"
        ></Box>
      </Box>
    </Box>
  );
}

export default Form;
