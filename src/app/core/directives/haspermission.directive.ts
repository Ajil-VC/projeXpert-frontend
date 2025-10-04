import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { PermissionsService } from '../../shared/utils/permissions.service';
import { Permissions } from '../domain/entities/roles.model';

@Directive({
  selector: '[appHaspermission]'
})
export class HaspermissionDirective {
  private tpl = inject<TemplateRef<any>>(TemplateRef);
  private vcr = inject(ViewContainerRef);
  private permission = inject(PermissionsService);


  @Input('appHaspermission') set hasPermission(required: Permissions[]) {

    this.vcr.clear();
    if (this.permission.has(required)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }

}
