import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionsService } from '../../shared/utils/permissions.service';
import { Permissions } from '../domain/entities/roles.model';

@Directive({
  selector: '[appHaspermission]'
})
export class HaspermissionDirective {

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private permission: PermissionsService
  ) { }

  @Input('appHaspermission') set hasPermission(required: Permissions[]) {

    this.vcr.clear();
    if (this.permission.has(required)) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }

}
