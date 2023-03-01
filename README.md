# Proposal:

```sh
npm install -g @vulkano/cli
```

Creating a controller

```sh
vulkano create controller
-> Enter the controller name: User
```

Creating a model

```sh
vulkano create model
-> Enter the model name: User
```

Saving a new record

```sh
vulkano save record
-> Select the model: User
-> Enter the "firstName": Jhon
-> Enter the "lastName": Doe
-> Enter the "email": jhon@doe.com
Do you want to save the record to the model "User"?  (Y/N)
```

Find records

```sh
vulkano find record
-> Select the model: User
-> Filter by: "email: jhon@doe.com"
```

Update record

```sh
vulkano update record
-> Select the model: User
-> Condition: "_id: ID"
-> Enter the field "firstName": "prepopulated"
-> Enter the field "lasttName": "prepopulated"
Do you want to update the record to the model "User"?  (Y/N)
```
