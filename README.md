#Proposal:

vulkano create controller
  Enter the controller name: User

vulkano create model
  Enter the model name: User

vulkano save record
  Select the model: User
    Enter the field "firstName"
    Enter the field "lastName"
Do you want to save the record to the model "User"?  (Y/N)

vulkano find record
  Select the model: User
    Filter by: "email: argordmel@gmail.com"

vulkano update record
  Select the model: User
    Condition: "_id: ID"
    Enter the field "firstName": "prepopulated"
    Enter the field "lasttName": "prepopulated"

Do you want to update the record to the model "User"?  (Y/N)