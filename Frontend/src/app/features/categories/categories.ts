import { Component, signal, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-categories',
  styleUrl: './categories.css',
  template: ` 
  <h1>Trainingskategorien</h1>
  <h2>Kategorie erfassen</h2>
  <form action="" method="POST">
    <label for="name"> Name:</label>
    <input type="text" id="name" name="name" required>
    </form>
  
  <h2>Kategorien</h2>  
  
  
  `,
})
export class Categories {}
