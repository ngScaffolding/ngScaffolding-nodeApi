import { WidgetModelBase } from '@ngscaffolding/models';
import { Observable } from 'rxjs';

export interface IWidgetDataAccess {
    getWidget(name: string): Observable<WidgetModelBase>;
    getAllWidgets(): Observable<WidgetModelBase[]>;
}