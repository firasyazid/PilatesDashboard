import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from '../services/userService';
import { ActivatedRoute, Router } from '@angular/router';
import { DragAndDropData, Question } from '../models/questions';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as DOMPurify from 'dompurify';
 
@Component({
  selector: 'app-drag-and-drop-component',
  templateUrl: './drag-and-drop-component.component.html',
  styleUrls: ['./drag-and-drop-component.component.css']
})
export class DragAndDropComponentComponent implements OnInit {
  questionForm: FormGroup;
  id: string | null = null;
  question: Question | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.fb.group({
      questionName: ['', Validators.required],
      questionText: ['', Validators.required],
      questionContent: ['', Validators.required],
      draggableItems: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ])
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getQuestionsById(this.id);
    }
  }
  cleanHtml(html: string): string {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extract text content from the temporary DOM element
    return tempDiv.textContent || '';
  }
  
  
  getQuestionsById(id: string): void {
    this.userService.getQuestionsbyId(id).subscribe(
      (data: Question) => {
        this.question = data;
        this.populateForm(data);
        console.log(this.question);
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  populateForm(question: Question): void {
    this.questionForm.patchValue({
      questionName: question.name,
      questionText: question.text,
      questionContent: question.dragAndDropData?.correctSequence.join('\n')
    });

     this.draggableItems.clear();
    question.dragAndDropData?.draggableItems.forEach(item => {
      this.draggableItems.push(this.fb.control(item, Validators.required));
    });
  }

  get draggableItems() {
    return this.questionForm.get('draggableItems') as FormArray;
  }

  addDraggableItem() {
    this.draggableItems.push(this.fb.control('', Validators.required));
  }

  removeDraggableItem(index: number) {
    this.draggableItems.removeAt(index);
  }

  splitCorrectSequence(sequence: string): string[] {
    // Regex to match placeholders like [[1]], [[2]]
    return sequence.split(/(\[\[\d+\]\])/);
  }




  generateCorrectResponse(sequenceParts: string[], draggableItems: string[]): string {
    // Initialize a counter for tracking the placeholder index
    let itemCounter = 0;
  
    // Map over the sequence parts and replace placeholders (e.g., [[1]], [[2]]) with draggable items
    const correctResponse = sequenceParts.map(part => {
      // Check if the part is a placeholder, e.g., [[1]], [[2]]
      if (this.isPlaceholder(part)) {
        // Replace the placeholder with the corresponding draggable item
        return draggableItems[itemCounter++] || ''; // Use an empty string if no draggable item exists for this placeholder
      }
      return part; // If it's not a placeholder, return the original static text
    }).join(''); // Join the parts to form the final correctResponse string
  
    return correctResponse;
  }


  
  isPlaceholder(part: string): boolean {
    // This checks if the part follows the pattern of a placeholder, e.g., [[1]], [[2]]
    return /\[\[\d+\]\]/.test(part);
  }
  

  onSubmit() {
    if (this.questionForm.valid && this.id) {
      // Create a partial update object
      const updatedFields: Partial<Question> = {};
      // Extract and log form values for debugging
      const questionName = this.questionForm.value.questionName;
      const questionText = this.questionForm.value.questionText;
      const rawContent = this.questionForm.value.questionContent;
  
      // Clean and join the content into a single string
      const correctSequence = rawContent.split('\n').map((line: string) => this.cleanHtml(line)).join(' ');
  
      // Split the entire correctSequence string using the splitCorrectSequence method
      const sequenceParts = this.splitCorrectSequence(correctSequence);
  
      console.log('Form Values:', { sequenceParts });
  
      if (questionName) {
        updatedFields.name = questionName;
      }
  
      if (questionText) {
        updatedFields.text = questionText;
      }
  
      // Handle dragAndDropData updates conditionally
      const dragAndDropData: Partial<DragAndDropData> = {};
  
      // Only store correctSequence and sequenceParts if they exist
      if (correctSequence && correctSequence.length > 0) {
        dragAndDropData.correctSequence = correctSequence;
      }
  
      if (sequenceParts && sequenceParts.length > 0) {
        dragAndDropData.correctSequenceParts = sequenceParts;
      }
  
      const draggableItems = this.questionForm.value.draggableItems;
      if (draggableItems && draggableItems.length > 0) {
        dragAndDropData.draggableItems = draggableItems;
      }
      if (sequenceParts && draggableItems) {
        let correctResponse = this.generateCorrectResponse(sequenceParts, draggableItems);
        dragAndDropData.correctResponse = correctResponse;
        console.log('Correct Response:', correctResponse);
      }
  
      // Assign the dragAndDropData object to updatedFields if it's not empty
      if (Object.keys(dragAndDropData).length > 0) {
        updatedFields.dragAndDropData = dragAndDropData as DragAndDropData;
      }
  
      console.log('Updated Fields:', updatedFields);
  
      // Submit the updated fields to the service
      if (Object.keys(updatedFields).length > 0) {
        this.userService.updateDragAndDropQuestion(this.id, updatedFields).subscribe(
          (response) => {
            console.log('Update successful:', response);
            this.snackBar.open('Question updated successfully!', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
          },
          (error) => {
            console.error('Error updating question:', error);
            this.snackBar.open('Failed to update question.', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            });
          }
        );
      } else {
        this.snackBar.open('No changes detected.', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-info']
        });
      }
    } else {
      this.snackBar.open('Please fill out the form correctly.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-warning']
      });
    }
  } 



}
  