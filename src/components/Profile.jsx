import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";

export default function Profile() {
  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const mobile = localStorage.getItem("mobile");
  const roleId = localStorage.getItem("roleId");
  const userId = localStorage.getItem("userId");

  // Map roleId → roleName (optional, if you want to show)
  const roleNames = {
    1: "Super Admin",
    3: "Operator",
    2: "Operational Manager",
    4: "Maintenance Manager",
    5: "Technician",
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 5,
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 80,
                height: 80,
                mx: "auto",
                fontSize: 32,
              }}
            >
              {fullName ? fullName[0] : "U"}
            </Avatar>
            <Typography variant="h5" sx={{ mt: 1 }}>
              {fullName || "Unknown User"}
            </Typography>
            <Chip
              label={roleNames[roleId] || `Role ID: ${roleId}`}
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider />

          <List>
            {/* <ListItem>
              <PersonIcon sx={{ mr: 2 }} />
              <ListItemText
                primary="User ID"
                secondary={userId || "N/A"}
              />
            </ListItem> */}
            <ListItem>
              <EmailIcon sx={{ mr: 2 }} />
              <ListItemText
                primary="Email"
                secondary={email || "Not provided"}
              />
            </ListItem>
            <ListItem>
              <PhoneIcon sx={{ mr: 2 }} />
              <ListItemText
                primary="Mobile"
                secondary={mobile || "Not provided"}
              />
            </ListItem>
            <ListItem>
              <BadgeIcon sx={{ mr: 2 }} />
              <ListItemText
                primary="Role"
                secondary={roleNames[roleId] || "Unknown Role"}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
