import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  @Input() title: string;
  @Input() body: string;
  @Input() link: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator', { read: ElementRef, static: true })
  truncator: ElementRef<HTMLElement>;

  @ViewChild('bodyText', { read: ElementRef, static: true })
  bodyText: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    //work out if there is a text overflow and if not then hide the truncator

    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight = parseInt(style.getPropertyValue('height'), 10);

    if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
      // if there is text overflow , show th fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      // if there is no  text overflow , dont show th fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }

  onXButtonClick() {
    this.deleteEvent.emit();
  }
}
