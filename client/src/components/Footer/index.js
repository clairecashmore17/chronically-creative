import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import "./index.css";
function Footer() {
  const [open, setOpen] = useState(false);

  const toggleFooter = () => {
    setOpen(!open);
  };
  return (
    <div className="footer">
      <button id="footer-btn" onClick={toggleFooter}>
        Learn more..
      </button>
      <Drawer
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
        open={open}
        anchor="bottom"
      >
        <Paper>
          <div className="toggled-footer">
            <p>Copyright Ⓒ Chronically Creative</p>
            <p>
              Page created by:
              <a href="https://github.com/clairecashmore17" target={"_blank"}>
                Claire Cashmore
              </a>
            </p>
            <div>
              <h5>Contact us!</h5>
              <p>
                Email: <a>chronically_creative@gmail.com</a>
              </p>
              <p>
                Follow our instagram at <a>chronically_creative</a>
              </p>
            </div>
            <button id="footer-btn" onClick={toggleFooter}>
              Close
            </button>
          </div>
        </Paper>
      </Drawer>
    </div>
  );
}
export default Footer;
