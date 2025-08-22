import { CommonModule } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
import { LoaderService } from '../../data/loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

  @Input() isLoading = false;
  isCollapsed!: boolean;

  constructor(private loadSer: LoaderService) {

    effect(() => {

      this.isCollapsed = this.loadSer.isCollapsed();

    })
  }

  ngOnInit() {
    this.loadSer.loading$.subscribe(signal => {
      this.isLoading = signal;
    })
  }

}
