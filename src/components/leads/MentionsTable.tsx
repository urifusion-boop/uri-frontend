import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const mockData = [
  {
    leadName: "John Doe",
    socialChannel: "LinkedIn",
    profileLink: "View Profile",
    mentionPreview: "This is a sample mention preview from LinkedIn...",
  },
  {
    leadName: "Jane Smith",
    socialChannel: "LinkedIn",
    profileLink: "View Profile",
    mentionPreview: "Another mention preview about a trending topic...",
  },
];

const MentionsTable: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Lead Name</TableCell>
            <TableCell>Social Channel</TableCell>
            <TableCell>Lead Profile</TableCell>
            <TableCell>Mention Preview</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockData.map((mention, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography>{mention.leadName}</Typography>
              </TableCell>
              <TableCell>
                <LinkedInIcon sx={{ color: "#0077B5" }} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "#6200EA" }}>
                  {mention.profileLink}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>{mention.mentionPreview}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MentionsTable;
