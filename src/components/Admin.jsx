import React, { useContext } from 'react';
import RoleContext from './RoleContext';
import AdminPage from './AdminPage';
import Typography from '@material-ui/core/Typography';

const Admin = () => {
  const role = useContext(RoleContext);
  if (role === 'admin') {
    return <AdminPage />;
  } else {
    return (
      <Typography variant="h5" align="center">
        You don't have access to Administrator page.
      </Typography>
    );
  }
};

export default Admin;
