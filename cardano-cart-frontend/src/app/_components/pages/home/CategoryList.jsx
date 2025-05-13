"use client"
import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

const categories = [
  { name: "Electronics", hasSubmenu: true },
  { name: "Phones & Tablets", hasSubmenu: false },
  { name: "Fashion", hasSubmenu: true },
  { name: "Health & Beauty", hasSubmenu: false },
]

export default function Sidebar() {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
        height: "100%",
      }}
    >
      <List>
        {categories.map((category, index) => (
          
          <ListItem
            key={index}
            disablePadding
            sx={{
              borderBottom:
                index < categories.length - 1
                  ? "1px solid rgba(0, 0, 0, 0.06)"
                  : "none",
              py: 0.5,
            }}
          >
            <ListItemButton sx={{ borderRadius: 1 }}>
              <ListItemText
                primary={
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {category.name}
                  </Typography>
                }
              />
              {category.hasSubmenu && <ChevronRightIcon color="action" />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
