import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        minWidth: '300px',
        borderRadius:'5px'
      }}>
        <h2>Confirm Deletion</h2>
        <hr/>
        <br/>
        <p>Are you sure you want to delete this plant?</p>
        <br/>
   

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onConfirm} variant="contained" style={{color:'white',background:'red'}}color="primary">
            Yes, Delete
          </Button>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
         
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
