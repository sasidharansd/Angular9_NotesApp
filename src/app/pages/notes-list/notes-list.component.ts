import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Note } from '../../shared/notes.model';

import { from } from 'rxjs';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [],
})
export class NotesListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;
  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    // we want to retriebve all notes from the service
    this.notes = this.notesService.getAll();
    //  this.filteredNotes = this.notesService.getAll();
    this.filter('');
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  generateNoteURL(note: Note) {
    let noteId = this.notesService.getId(note);
    return noteId;
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();

    let terms: string[] = query.split(' ');
    //remove duplicate searches
    terms = this.removeDuplicates(terms);
    //compile all relavant results into the allResults array
    terms.forEach((term) => {
      let results = this.relavantNotes(term);
      // append results to the all results array
      allResults = [...allResults, ...results]; // it will merge all results from both arrayy\s
    });

    //allresults will include duplicate notes
    // because particular note can be result of maany search termms
    // we dont want to show the same not multiple timses on th e ui
    // so we first must remove the dupliucates

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    // now sort by relevvancy
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    //loop through the input aray and add the items to the set
    arr.forEach((e) => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relavantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relavantNotes = this.notes.filter((note) => {
      // using incluides we can checlk whether it contains the strings
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });

    return relavantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    // this metjod calculates the relevancy offthe note based on no of time it appeared in search result

    let noteCountObj: Object = {}; // format- key:value => NoteId:number(note object id : count)

    searchResults.forEach((note) => {
      let noteId = this.notesService.getId(note);

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] += 1;
      }
    });
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    });
  }
}
