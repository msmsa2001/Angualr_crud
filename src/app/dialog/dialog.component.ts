import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  productFrom !: FormGroup;
  actionButton:String= "Save";
  constructor(private formBuilder: FormBuilder, 
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData : any, 
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productFrom = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required]
    })
    // console.log(this.editData)
    if(this.editData){
      this.actionButton ="Update"
      this.productFrom.controls['productName'].setValue(this.editData.productName);
      this.productFrom.controls['category'].setValue(this.editData.category);
      this.productFrom.controls['freshness'].setValue(this.editData.freshness);
      this.productFrom.controls['price'].setValue(this.editData.price);
      this.productFrom.controls['comment'].setValue(this.editData.comment);
      this.productFrom.controls['date'].setValue(this.editData.date);
    }
  }
  addProduct() {
    if(!this.editData){
      if (this.productFrom.valid) {
        this.api.postProduct(this.productFrom.value)
          .subscribe({
            next: (res) => {
              alert("Product Added Sucessfully")
              this.productFrom.reset();
              this.dialogRef.close('save')
            },
            error: () => {
              alert("Error While adding the product")
            }
          })
      }
    }
      else{
        this.updateProduct();
      }
    }
    updateProduct(){
      this.api.putProduct(this.productFrom.value,this.editData.id)
      .subscribe({
        next:(res)=>{
          alert("Product updated Successfully");
          this.productFrom.reset();
          this.dialogRef.close('update')
        },
        error:()=>{
          alert("Error While update the product")
        }
      })
    }
  }
  


