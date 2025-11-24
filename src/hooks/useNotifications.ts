import { useSelector, useDispatch } from "react-redux";
import { setShowNotification, setNotificationMessage } from "@/src/redux/notificationsSlice";

export const useNotifications = () => {
  const notificationsData = useSelector((state: any) => state.notifications);
  const { showNotification, notificationMessage } = notificationsData;

  const dispatch = useDispatch();

  const saveShowNotification = (show: boolean) => {
    dispatch(setShowNotification(show));
  };

  const saveNotificationMessage = (message: string) => {
    dispatch(setNotificationMessage(message));
  };

  return {
    showNotification,
    notificationMessage,
    
    saveShowNotification,
    saveNotificationMessage,
  }
};