export const getDialogContent = (status: string) => {
    console.log(status, 'status')
    return {
      title: status === "UNACCEPTED" 
        ? "Are you sure you want to accept this participant?" 
        : "Are you sure you want to approve task request?",
      subTitle: status === "UNACCEPTED"
        ? "This will allow the participant to start working on the task"
        : "This action cannot be undone",
      buttonName: status === "UNACCEPTED" ? "Accept" : "Approve"
    };
};
  


  export const getDialogContents = (buttonState:string) => {
    if (buttonState === "COMPLETEd") {
      return {
        title: "Are you sure you want to mark this task as completed?",
        subTitle: "This action cannot be undone",
        buttonName: "Complete"
      };
    } else if (buttonState === "WAITING" || buttonState === "COMPLETED") {
      return null;
    } else {
      return {
        title: "Are you sure you want to apply for this task?",
        subTitle: `This task has ${1} slots available`,
        buttonName: "Apply"
      };
    }
  };