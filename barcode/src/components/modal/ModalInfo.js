import { Modal } from 'antd';

function modalInfo(status, title, content) {
  Modal.destroyAll();
  let secondsToGo = 5;
  const modal = Modal[status]({
    title,
    content,
  });
  const timer = setInterval(() => {
    secondsToGo -= 1;
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    modal.destroy();
  }, secondsToGo * 1000);
}

export default modalInfo;
